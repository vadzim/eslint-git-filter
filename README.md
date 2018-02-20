# eslint-git-filter

git filter for eslint

Add to your git config:
```
[filter "eslint"]
  clean = eslint-git-filter [...switches] --filename="%f"
```

Add to your .gitattributes file:
```
*.js	filter=eslint
```

Possible switches are:

  --standalone - Do not start service. Default is off.

  --socket=<PortNumber|UnixPath> - Use this socket for the service instead of automatic detection. By default each git directory is handled by its own service.
  
  --service-idle-time=<Number of seconds> - Default is 7200.
