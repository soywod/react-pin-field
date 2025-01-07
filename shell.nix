{ nixpkgs ? <nixpkgs>, system ? builtins.currentSystem
, pkgs ? import nixpkgs { inherit system; }, extraBuildInputs ? "" }:

let
  inherit (pkgs) cypress lib mkShell nodejs;
  inherit (lib) attrVals getExe optionals splitString;

  yarn = pkgs.yarn.override { inherit nodejs; };
  extraBuildInputs' = optionals (extraBuildInputs != "")
    (attrVals (splitString "," extraBuildInputs) pkgs);

in mkShell {
  buildInputs = [ nodejs yarn cypress ] ++ extraBuildInputs';

  shellHook = ''
    # configure cypress
    export CYPRESS_RUN_BINARY="${getExe cypress}"

    # add node_modules/.bin to path
    export PATH="$PWD/node_modules/.bin/:$PATH"
  '';
}
