---
name: view-stop
description: Stop the Ketchup events viewer
user-invocable: true
---

!`pkill -f 'dist/bundle/scripts/events-viewer.js' && echo 'Ketchup viewer stopped' || echo 'No Ketchup viewer running'`
