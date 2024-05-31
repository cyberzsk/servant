{
  description = "Servant Discord Bot";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixpkgs-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system: let
      pkgs = nixpkgs.legacyPackages.${system};
    in {
      devShell = pkgs.mkShell {
        nativeBuildInputs = [ pkgs.bashInteractive ];
        buildInputs = with pkgs; [
          nodePackages.typescript-language-server
          nodePackages.vscode-json-languageserver
          nodePackages.yarn
          nodePackages.pnpm
          nodePackages.npm
          nodejs-slim
          openssl
        ];
      };
    });
}
