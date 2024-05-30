deno/task/%: node_modules FORCE
	deno task $*

.PHONY: start
start: .env deno/task/start

.PHONY: lint
lint: deno/task/check

.PHONY: test
test: lint
	deno test

.PHONY: build
build: .env
	deno task build

.PHONY: .env
.env: vapid.json
	printf "DENOTIFY_VAPID_PUBLIC_KEY='%s'\n" '$(shell jq -c '.publicKey' < vapid.json)' > $@
	printf "DENOTIFY_VAPID_PRIVATE_KEY='%s'\n" '$(shell jq -c '.privateKey' < vapid.json)' >> $@

vapid.json:
	deno run -A https://raw.githubusercontent.com/negrel/webpush/master/cmd/generate-vapid-keys.ts > vapid.json

.PHONY: clean
clean:
	rm -f .env vapid.json

node_modules:
	deno cache **/*.{js,ts,tsx}

FORCE:
