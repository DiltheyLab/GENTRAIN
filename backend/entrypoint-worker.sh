#!/bin/bash
mkdir -p /backend/logs
supervisord -c /backend/supervisor_dev.conf