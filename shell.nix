{ nixpkgs ? <nixpkgs>, system ? builtins.currentSystem
, pkgs ? import nixpkgs { inherit system; }, extraBuildInputs ? "" }:

let
  inherit (pkgs) cypress lib mkShell nodejs playwright playwright-driver;
  inherit (lib) attrVals getExe optionals splitString;

  yarn = pkgs.yarn.override { inherit nodejs; };
  extraBuildInputs' = optionals (extraBuildInputs != "")
    (attrVals (splitString "," extraBuildInputs) pkgs);

in mkShell {
  buildInputs = [ nodejs yarn cypress playwright playwright-driver.browsers ]
    ++ extraBuildInputs';
  shellHook = ''
    # configure cypress
    export CYPRESS_RUN_BINARY="${getExe cypress}"

    # add node_modules/.bin to path
    export PATH="$PWD/node_modules/.bin/:$PATH"

    export PLAYWRIGHT_BROWSERS_PATH=${playwright-driver.browsers}
    export PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS=true
  '';
}
