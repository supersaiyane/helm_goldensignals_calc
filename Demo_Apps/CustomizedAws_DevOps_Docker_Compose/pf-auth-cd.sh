#check the current image tag version from Docker-compose file
old_image_string="$(grep -P \^\.\*550677539815.dkr.ecr.us-east-2.amazonaws.com/pf-auth-service\.\*\$ /home/ubuntu/pf-ops/docker-compose.yaml)"
echo $old_image_string
old_image_tag=${old_image_string##*:}
echo $old_image_tag

#check the current image tag version from Docker-compose file
latest_image_string="$(grep -P \^\.\*550677539815.dkr.ecr.us-east-2.amazonaws.com/pf-auth-service\.\*\$ /home/ubuntu/iambatman/pf-auth/imagedefinitions.json)"
echo $latest_image_string
latest_image_tag=$(echo ${latest_image_string##*:} | tr -dc '0-9')
echo $latest_image_tag

#Replacing the latest tag with old tag
sed -i 's/pf-auth-service:'$old_image_tag'/pf-auth-service:'$latest_image_tag'/g' /home/ubuntu/pf-ops/docker-compose.yaml

#Replacing the latest tag with old tag for grpc service
#sed -i 's/pf-auth-grpc:'$old_image_tag'/pf-auth-grpc:'$latest_image_tag'/g' /home/ubuntu/pf-ops/docker-compose.yaml

#for verification purpose-auth_service
image_number_2="$(grep -P \^\.\*550677539815.dkr.ecr.us-east-2.amazonaws.com/pf-auth-service\.\*\$ /home/ubuntu/pf-ops/docker-compose.yaml)"
echo $image_number_2

#for verification purpose-auth_grpc
#image_number_3="$(grep -P \^\.\*550677539815.dkr.ecr.us-east-2.amazonaws.com/pf-auth-grpc\.\*\$ /home/ubuntu/pf-ops/docker-compose.yaml)"
#echo $image_number_3

#executing docker-compose commands and login ECR
aws ecr get-login-password --region us-east-2 | docker login --username AWS --password-stdin 550677539815.dkr.ecr.us-east-2.amazonaws.com
cd /home/ubuntu/pf-ops
docker-compose ps
docker-compose -f docker-compose.yaml up -d --force-recreate --no-deps pf-auth-service
