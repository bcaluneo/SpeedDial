MAIN = server.js
OUTDIR = public
SRCDIR = src

build:
	npx tsc --outDir "public"
	node_modules\.bin\browserify public\index.js -p esmify > public\bundle.js
	move "public\$(MAIN)" "$(MAIN)"

run : build
	web-ext run

dev : build
	node "$(CURDIR)"\$(MAIN)
