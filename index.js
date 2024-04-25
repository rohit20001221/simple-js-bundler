const fs = require("fs");
const path = require("path");
const babylon = require("babylon");
const traverse = require("@babel/traverse");
const { transformFromAst } = require("babel-core");

let ID = 0;

const createAsset = (filename) => {
  const content = fs.readFileSync(filename, "utf-8");

  const ast = babylon.parse(content, {
    sourceType: "module",
  });

  const dependencies = [];
  traverse.default(ast, {
    ImportDeclaration: ({ node }) => {
      dependencies.push(node.source.value);
    },
  });

  const { code } = transformFromAst(ast, null, {
    presets: ["env"],
  });

  const id = ID;

  ID++;

  return {
    filename,
    id,
    dependencies,
    code,
  };
};

const createGraph = (entry) => {
  const mainAsset = createAsset(entry);

  const queue = [mainAsset];

  // graph traversal
  for (const asset of queue) {
    const dirname = path.dirname(asset.filename);

    asset.mapping = {};

    asset.dependencies.forEach((relativePath) => {
      const absolutePath = path.join(dirname, relativePath);

      const child = createAsset(absolutePath);
      asset.mapping[relativePath] = child.id;

      queue.push(child);
    });
  }

  return queue;
};

const bundle = (graph) => {
  let modules = "";

  graph.forEach((mod) => {
    modules += `${mod.id}: {
        fn: function(require, module, exports) { ${mod.code} },
        map: ${JSON.stringify(mod.mapping)}
    },`;
  });

  return `(function (modules) {
    function require(moduleId) {
        const module = modules[moduleId];

        function localRequire(relativePath) {
            const id = module.map[relativePath]
            
            return require(id)
        }

        const localModule = { exports: {} };
        
        module.fn(localRequire, localModule, localModule.exports)
    
        return localModule.exports
    }

    require(0)
  })({${modules}});`;
};

const graph = createGraph("./example/entry.js");
console.log(graph);

const output = bundle(graph);

fs.writeFileSync("./bundle.js", output);
