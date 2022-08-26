include .env
export $(shell sed 's/=.*//' .env)
chmod +x ./mc
./mc alias set ecommerce $(S3_PUBLIC_ENDPOINT) $(S3_ACCESS_KEY_ID) $(S3_SECRET_ACCESS_KEY);
./mc mb ecommerce/images
./mc mb ecommerce/videos
./mc admin policy add ecommerce adminpolicy admin-policy.json
./mc admin user add ecommerce $(S3_ADMIN_ACCOUNT) $(S3_ADMIN_PASSWORD);
./mc admin policy set ecommerce adminpolicy user=$(S3_ADMIN_ACCOUNT);
./mc policy set download ecommerce/images;
./mc policy set public ecommerce/images;
./mc policy set download ecommerce/videos;
./mc policy set public ecommerce/videos;
echo "\n\n Dev Ready!   API: $(SERVER_PUBLIC_URL)      S3: $(S3_WEB_ENDPOINT)"