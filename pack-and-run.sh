dir="/home/oleg/projects/docedit"
run="ckeditor"
args="/home/oleg/projects/emergency_sunpp"

cd ${dir}/apps
rm *.nw
for app in *
do
    if [ -d "${app}" ]; then
        cd ${app}
        zip -9 -y -r -q ../${app}.nw ./*
        cd ..
    fi
done
cd ..

killall ${run}.app
cat ./nw ./apps/${run}.nw > ./${run}.app
chmod +x ./${run}.app
./${run}.app ${args}
rm ./${run}.app

