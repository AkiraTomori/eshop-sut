#!/bin/bash
killall node
cd /Users/thaiminhhuy/docs/Github/eshop-sut/backend && node server.js &
cd /Users/thaiminhhuy/docs/Github/eshop-sut/frontend-web && npm run dev &
cd /Users/thaiminhhuy/docs/Github/eshop-sut/frontend-admin && npm run dev &
