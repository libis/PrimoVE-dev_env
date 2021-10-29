#!/bin/bash
CODE_DIR=$1
if [ -z "$CODE_DIR" ]; then
  CODE_DIR='32KUL_LIBIS_NETWORK??'
fi

VIEWS="32KUL_LIBIS_NETWORK-CENTRAL_PACKAGE"
OS=$(uname -s)

if [ -e "./package" ]; then
  mkdir -p "./package/"
fi

for VIEW in $VIEWS; do
  echo "Packaging $VIEW"
  if [ -e "./package/$VIEW.zip" ]; then
    rm ./package/$VIEW.zip
  fi

  if [ -e "./tmpPackage" ]; then
    rm -Rf "./tmpPackage"
  fi

  mkdir -p "./tmpPackage/$VIEW"
  cd "./tmpPackage"
  cp -rp ../resources/general/* ./$VIEW
  cp -rp ../resources/$VIEW/* ./$VIEW
  if [ ! -e "./$VIEW/js" ]; then
    mkdir ./$VIEW/js
  fi
  #TODO: make dynamic
  cp -rp ../dist/$CODE_DIR/js/custom.js ./$VIEW/js
  
  find . -name '.DS_Store' -exec rm -f {} \;

  if [ "$OS" = "Darwin" ]; then
    COPYFILE_DISABLE=1 zip -q -r ../package/$VIEW.zip ./$VIEW
  else
    zip -q -r ../package/$VIEW.zip ./$VIEW
  fi

  cd -
  rm -Rf "./tmpPackage"
done
