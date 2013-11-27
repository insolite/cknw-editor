project_name="cknw-editor"
platform="linux"
executable="${project_name}"

dir_root=$(pwd)
dir_project="${dir_root}/../.."
dir_builds="${dir_project}/build"
dir_build="${dir_builds}/${project_name}-${platform}"
dir_build_tmp="${dir_build}/tmp"
dir_source="${dir_project}/${project_name}"
dir_node_webkit="${dir_project}/node-webkit/${platform}"

mkdir -p ${dir_builds}
mkdir -p ${dir_build}
mkdir -p ${dir_build_tmp}

cd ${dir_source}/ckeditor/plugins
for plugin in ${dir_source}/ckeditor-extra-plugins/*
do
    rm -f ./$(basename ${plugin})
    ln -s ${plugin} ./$(basename ${plugin})
done

cd ${dir_source}
zip -9 -r -q "${dir_build_tmp}/${project_name}.nw" ./*

cat ${dir_node_webkit}/nw ${dir_build_tmp}/${project_name}.nw > ${dir_build}/${executable}
chmod +x ${dir_build}/${project_name}
cp ${dir_node_webkit}/nw.pak ${dir_build}

rm -rf ${dir_build_tmp}

run="${dir_build}/${executable}"
args="/home/oleg/projects/emergency_sunpp"
${run} ${args}
