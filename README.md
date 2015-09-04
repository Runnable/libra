# libra
white magic spell which displays information about a process from /proc
libra will look up information on a _single_ process based on name.
If more then one process share the same name, libra will return an error

# inputs
inputs into libra are environment variables

## LOOKUP_CMD
command to search on.

example: if `ps` returns
```
36916 ttys000    0:00.08 bash
39588 ttys001    0:00.05 node
```
if you want to get information on `node` set `LOOKUP_CMD=node`


## LOOKUP_ARGS
any additional arguments on the command to also search for

example: if `ps` returns
```
36916 ttys000    0:00.08 node -a
39588 ttys001    0:00.05 node -d
```
if you want to get information on `node -a` set `LOOKUP_CMD=node` and  `LOOKUP_ARGS=-a`


# usage

```
docker run -it --pid=host --privileged --rm -e LOOKUP_CMD='/docker' -e LOOKUP_ARGS='-d' runnable/libra
```

# output
## on success
```
{"info":{"FDSize":2048,"VmPeak":"33373208 kB","VmSize":"33373208 kB","VmHWM":"503816 kB","VmRSS":"375808 kB","VmData":"33359456 kB","VmStk":"136 kB","VmExe":"13444 kB","VmPTE":"9756 kB","Threads":1980,"voluntary_ctxt_switches":444,"nonvoluntary_ctxt_switches":623,"rchar":229278009179,"wchar":164334551263,"syscr":176566383,"syscw":48958240,"read_bytes":268124160,"write_bytes":74151432192,"cancelled_write_bytes":38762946560}}
```

## on error
```
{"error":"unable to get process"}
```

# notes
this container must be run with `--pid=host` if you want to inspect processes on the host
if process is privileged you will also need `--privileged`