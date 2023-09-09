{
  description = "React component for entering PIN codes.";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-23.05";
    utils.url = "github:numtide/flake-utils";
    flake-compat = {
      url = "github:edolstra/flake-compat";
      flake = false;
    };
  };

  outputs = { self, nixpkgs, utils, ... }:
    utils.lib.eachDefaultSystem
      (system:
        let
          pkgs = import nixpkgs { inherit system; };
          nodejs = pkgs.nodejs-18_x;
          yarn = pkgs.yarn.override { inherit nodejs; };
        in
        {
          devShell = pkgs.mkShell {
            buildInputs = with pkgs; [
              # Nix env
              rnix-lsp
              nixpkgs-fmt

              # Node.js env
              nodejs
              yarn
              cypress
            ];
            shellHook = ''
              # configure cypress
              export CYPRESS_RUN_BINARY="${pkgs.cypress}/bin/Cypress"

              # add node_modules/.bin to path
              export PATH="$PWD/node_modules/.bin/:$PATH"
            '';
          };
        }
      );
}
