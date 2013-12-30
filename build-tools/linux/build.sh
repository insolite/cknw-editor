#Variables
project_name="cknw-editor"
platform="linux"
platform_capacity="x64" #x64, ia32
node_webkit_version="0.8.4"
executable="${project_name}"

#Dir variables
dir_build_tools=`dirname "$(readlink -f "$0")"`
dir_project="${dir_build_tools}/../.."
dir_builds="${dir_project}/build"
dir_build="${dir_builds}/${project_name}-${platform}"
dir_build_tmp="${dir_build}/tmp"
dir_source="${dir_project}/${project_name}"
dir_node_webkit="${dir_project}/node-webkit/${platform}"

#Remove previous build
${dir_build_tools}/clean.sh

#Initial setup
mkdir -p ${dir_builds}
mkdir -p ${dir_build}
mkdir -p ${dir_build_tmp}

#Project specific block begin

#CKEditor submodule download and build
if [ ! -d "${dir_project}/ckeditor/dev/builder/release" ]; then
    #get built library if exists
    cd ${dir_project}
    git submodule init
    git submodule update
    ./ckeditor/dev/builder/build.sh
fi

#Generate links for new extra ckeditor plugins
cd ${dir_project}/ckeditor/dev/builder/release/ckeditor/plugins
for plugin in ${dir_source}/ckeditor-extra-plugins/*
do
    rm -f ./$(basename ${plugin})
    ln -s ${plugin} ./$(basename ${plugin})
done

#Add submodule to archive
cd "${dir_project}/ckeditor/dev/builder/release"
zip -9 -r -q -g "${dir_build_tmp}/${project_name}.nw" ./ckeditor

#TODO: add external plugins here


#Project specific block end

#Zip application
cd ${dir_source}
zip -9 -r -q -g "${dir_build_tmp}/${project_name}.nw" ./*

#Get node-webkit build
if [ ! -d ${dir_node_webkit} ]; then
    mkdir -p ${dir_node_webkit}
    cd ${dir_node_webkit}
    wget -O ./node-webkit.tar.gz "https://s3.amazonaws.com/node-webkit/v0.8.4/node-webkit-v${node_webkit_version}-linux-${platform_capacity}.tar.gz"
    tar --strip-components=1 -xf ./node-webkit.tar.gz
fi

#Pack application with node-webkit
cat ${dir_node_webkit}/nw ${dir_build_tmp}/${project_name}.nw > ${dir_build}/${executable}
chmod +x ${dir_build}/${project_name}

#Copy additional node-webkit files
cp ${dir_node_webkit}/nw.pak ${dir_build}

#Clean up
rm -rf ${dir_build_tmp}

