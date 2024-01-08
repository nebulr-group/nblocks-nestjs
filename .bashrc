aarch64_mongoms () {
    echo "Picking MongoMemoryServer binaries for aarch64"
    export MONGOMS_VERSION=5.0.23
    export MONGOMS_DOWNLOAD_URL=https://fastdl.mongodb.org/linux/mongodb-linux-aarch64-ubuntu1804-5.0.23.tgz
    export MONGOMS_DEBUG=0
}

amd64_mongoms () {
    echo "Picking MongoMemoryServer binaries for amd64/x86_64"
    export MONGOMS_VERSION=5.0.23
    export MONGOMS_DOWNLOAD_URL=https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-debian10-5.0.23.tgz
    export MONGOMS_DEBUG=0
}

ARCH=$(uname -m)

if [ "$ARCH" == "aarch64" ]
then
    aarch64_mongoms
else
    amd64_mongoms
fi