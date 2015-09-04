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
docker run -it --pid=host --rm -e LOOKUP_CMD='/docker' LOOKUP_ARGS='-d' runnable/libra
```

# output
## on success
```

```

## on error
```
{"error":"unable to get process"}
```

# notes
this container must be run with `--pid=host` if you want to inspect processes on the host
