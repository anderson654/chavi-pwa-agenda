#!/bin/bash
quasar build -m pwa
aws configure set preview.cloudfront true
aws s3 sync --acl public-read --profile chavi --delete dist/pwa s3://agenda.chavi.com.br
aws cloudfront --profile chavi create-invalidation --distribution-id E1H20MZ7R0O722 --paths '/*'