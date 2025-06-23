#!/bin/bash
ENV=$1

helm install calc-$ENV ./golden-signal-chart -f values-$ENV.yaml


