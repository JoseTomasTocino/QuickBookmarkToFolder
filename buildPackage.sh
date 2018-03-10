#!/bin/bash

cd app

VERSION=$(cat manifest.json | jq '.version' -r)
PACKAGE_FOLDER=../packages
PACKAGE_FILENAME=QuickBookmarkToFolder-$VERSION.zip
PACKAGE_PATH=$PACKAGE_FOLDER/$PACKAGE_FILENAME 
zip -r $PACKAGE_PATH *

echo "Written $PACKAGE_PATH"
