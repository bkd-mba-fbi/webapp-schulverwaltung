#!/bin/bash
# Script to copy a ready-made production build from
# dist/webapp-schulverwaltung to the given directory, merging the
# existing index.html with the styles from the new index.html

if [[ $# -ne 1 ]]; then
  echo "Usage: $0 /path/to/evento-portal/public/apps/webapp-schulverwaltung/"
  exit 1
fi

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
BUILD_DIR=$( realpath $SCRIPT_DIR/../dist/webapp-schulverwaltung )
PORTAL_WEBAPP_DIR=$( realpath $1 )

echo "Copying build from $BUILD_DIR to $PORTAL_WEBAPP_DIR..."

# Replace all files except settings.js and index.html with the new
# build, deleting any obsolete files
rsync -av --delete --exclude={settings.js,index.html} $BUILD_DIR/ $PORTAL_WEBAPP_DIR/

# Replace the styles in the existing index.html with those generated
# by the new build (slashes and backslashes have to be escaped in
# sed's input string) but leave everything else as-is
TMP=$(grep -o '<style>@import.*</noscript>' $BUILD_DIR/index.html | sed 's/\\/\\\\/g' |  sed 's/\//\\\//g')
sed  -i "s/.*@import.*/    $TMP/" $PORTAL_WEBAPP_DIR/index.html
