#Variables
project_name="cknw-editor"
platform="linux"
executable="${project_name}"

#Dir variables
dir_root=`dirname "$(readlink -f "$0")"`
dir_project="${dir_root}/../.."
dir_builds="${dir_project}/build"
dir_build="${dir_builds}/${project_name}-${platform}"

#Clean up
rm -rf ${dir_build}

