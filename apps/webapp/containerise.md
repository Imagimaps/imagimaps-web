`podman build -t [container tag] -f [dockerfile path] [context path]`
`podman build -t testwebappbuild1 -f Dockerfile ../..`


# Local Only
`podman build -t localwebapp1 -f Dockerfile.local .`
`podman run -it -p 8080:80 localhost/localwebapp1`
