const path = require("path");
const fs = require("fs");
const dayjs = require("dayjs");

const getFommattedDate = function() {
  let now = new dayjs();
  return now.format("YYYYMMDD_HHmmss");
};

module.exports = {
  outputDir: process.env.OUTPUT_DIR + "_" + getFommattedDate(),
  publicPath:
    process.env.NODE_ENV === "production" ||
    process.env.npm_lifecycle_event === "translate"
      ? "/dist/"
      : "http://app.local.xis.com:8180/",
  // disable hashes in filenames
  filenameHashing: true,
  runtimeCompiler: true,
  productionSourceMap: true,
  lintOnSave: false,
  devServer: {
    host: "app.local.xis.com",
    port: 8180,
    https: false,
    disableHostCheck: true,
    overlay: {
      warnings: true,
      errors: true
    },
    headers: {
      "Access-Control-Allow-Origin": "*"
    }
  }
}