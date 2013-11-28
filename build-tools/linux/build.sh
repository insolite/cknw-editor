#Variables
project_name="cknw-editor"
platform="linux"
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

#Generate links for new extra ckeditor plugins
cd ${dir_source}/ckeditor/plugins
for plugin in ${dir_source}/ckeditor-extra-plugins/*
do
    rm -f ./$(basename ${plugin})
    ln -s ${plugin} ./$(basename ${plugin})
done

#Project specific block end

#Zip application
cd ${dir_source}
zip -9 -r -q "${dir_build_tmp}/${project_name}.nw" ./*

#Pack application with node-webkit
cat ${dir_node_webkit}/nw ${dir_build_tmp}/${project_name}.nw > ${dir_build}/${executable}
chmod +x ${dir_build}/${project_name}

#Copy additional node-webkit files
cp ${dir_node_webkit}/nw.pak ${dir_build}

#Clean up
rm -rf ${dir_build_tmp}

