# Installing redis natively

## Install

Download a stable release of redis
```bash
curl -O http://download.redis.io/redis-stable.tar.gz
```

Untar redis
```bash
tar xvzf redis-stable.tar.gz
```

Change into the redis-stable directory
```bash
cd redis-stable
```

Compile redis
```bash
make
```

Ensure the build has worked correctly
```bash
make test
```

Add this to your PATH
```bash
/usr/local/bin/
```

Copy over redis-server to the correct place
```bash
sudo cp src/redis-server /usr/local/bin/
```

Copy over redis-cli to the correct place
```
sudo cp src/redis-cli /usr/local/bin/
```

Bring up the server
```bash
redis-server
```

Talk to redis (new tab)
```bash
redis-cli
127.0.0.1:6379 > ping
PONG
```

## Uninstall
```bash
rm -rf /usr/local/bin/redis-server 
rm -rf /usr/local/bin/redis-cli
```
