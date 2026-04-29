#!/bin/bash
SESSION_ID=$(node -e "let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>console.log(JSON.parse(d).session_id));")
echo "$SESSION_ID" > "$(dirname "$0")/../last-session-id.txt"
