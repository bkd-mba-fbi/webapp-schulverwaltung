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

# Replace the styles and scripts in the existing index.html with those generated
# by the new build but leave everything else as-is
STYLES_REGEX="<style>.*</noscript>"
STYLES=$(grep -o "$STYLES_REGEX" $BUILD_DIR/index.html)
if [[ -n $STYLES ]]; then
  sed -i "s~$STYLES_REGEX~$STYLES~" $PORTAL_WEBAPP_DIR/index.html
else
  echo "No styles found in $BUILD_DIR/index.html"
  exit 1
fi

SCRIPTS_REGEX="<link rel=\"modulepreload\".*</script></body>"
SCRIPTS=$(grep -o "$SCRIPTS_REGEX" $BUILD_DIR/index.html)
if [[ -n $SCRIPTS ]]; then
  sed -i "s~$SCRIPTS_REGEX~$SCRIPTS~" $PORTAL_WEBAPP_DIR/index.html
else
  echo "No scripts found in $BUILD_DIR/index.html"
  exit 1
fi

