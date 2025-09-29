#!/bin/bash
mkdir -p /api/logs
supervisord -c /api/supervisor_dev.conf