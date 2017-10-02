DELETE FROM offer_catalogue;
INSERT INTO offer_catalogue (KEY, VALUE) VALUES ("brand_1",
   {
      "brandId":1,
	  "href": "<base_url><version>brand/1",
      "category":"Shopping",
      "description":"The latest men's collections from Hugo Boss Black and Green labels. The collection offers modern, refined business and evening wear along with sophisticated casual looks and premium sportswear.",
      "images":[
         {
            "displayPriority":0,
            "imageId":1,
			"href": "<base_url><version>brand/1/image/1",
            "location":"http://beziers.we-are-select.com/media/2014/05/hugo-boss-logo.jpg",
            "target":"WEB",
            "type":"BrandImage"
         }
      ],
      "logo":"https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Hugo-Boss-Logo.svg/langfr-220px-Hugo-Boss-Logo.svg.png",
      "name":"Boss",
      "partnershipId":"22",
      "subCategories":[
         "Fashion",
         "Men"
      ],
      "twitterHandle":"@HUGOBOSS",
      "type":"Brand",
      "website":"http://www.hugoboss.com",
	  'internalBrandName': 'HugoBoss',
      'isActive': true
   }
) RETURNING *;
INSERT INTO offer_catalogue (KEY, VALUE) VALUES ("brand_2",
   {
      "brandId":2,
	  "href": "<base_url><version>brand/2",
      "category":"Shopping",
      "description":"The latest men's collections from Hugo Boss Black and Green labels. The collection offers modern, refined business and evening wear along with sophisticated casual looks and premium One of the world's most iconic coffee brands offering a fine range of freshly roasted coffees, Italian-style espressos and ice-blended drinks, plus delicious panini, sandwiches, cakes and pastries.",
      "images":[
         {
            "displayPriority":0,
            "imageId":2,
			"href": "<base_url><version>brand/2/image/2",
            "location":"http://t1.gstatic.com/images?q=tbn:ANd9GcQxlUfeRTvlYEyHiglTuCF6Hr9iKdXgkKVPBDC3F97TDYS0TAieaeaahqk",
            "target":"WEB",
            "type":"BrandImage"
         },
         {
            "displayPriority":0,
            "imageId":3,
			"href": "<base_url><version>brand/2/image/3",
            "location":"http://t1.gstatic.com/images?q=tbn:ANd9GcQxlUfeRTvlYEyHiglTuCF6Hr9iKdXgkKVPBDC3F97TDYS0TAieaeaahqk",
            "target":"MOBILE",
            "type":"BrandImage"
         }
      ],
      "logo":"https://upload.wikimedia.org/wikipedia/en/thumb/3/35/Starbucks_Coffee_Logo.svg/1024px-Starbucks_Coffee_Logo.svg.png",
      "name":"Starbucks",
      "partnershipId":"22",
      "subCategories":[
         "On the go",
         "Coffee",
         "Breakfast"
      ],
      "twitterHandle":"@Starbucks",
      "type":"Brand",
      "website":"http://www.starbucks.com/",
	  'internalBrandName': 'Starbucks',
      'isActive': true
   }
) RETURNING *;

INSERT INTO offer_catalogue (KEY, VALUE) VALUES ("brand_3",
   {
      "brandId":3,
	  "href": "<base_url><version>brand/3",
      "category":"Shopping",
      "description":"Swiss watches are renowned for their quality and precision. And within the world of Swiss watches, TAG Heuer watches are known not just for quality and precision, but for avant-garde design and advanced technology too. For a sports heritage that inspires excellence. And for quality materials that create luxury watches for men and women.",
      "images":[
         {
            "displayPriority":0,
            "imageId":4,
			"href": "<base_url><version>brand/3/image/4",
            "location":"http://t1.gstatic.com/images?q=tbn:ANd9GcQxlUfeRTvlYEyHiglTuCF6Hr9iKdXgkKVPBDC3F97TDYS0TAieaeaahqk",
            "target":"All",
            "type":"BrandImage"
         },
         {
            "displayPriority":0,
            "imageId":5,
			"href": "<base_url><version>brand/3/image/5",
            "location":"http://t1.gstatic.com/images?q=tbn:ANd9GcQxlUfeRTvlYEyHiglTuCF6Hr9iKdXgkKVPBDC3F97TDYS0TAieaeaahqk",
            "target":"All",
            "type":"BrandImage"
         }
      ],
      "logo":"http://www.tagheuer.com/desktop/images/main-nav-logo.svg",
      "name":"Tag Heuer",
      "partnershipId":"20",
      "subCategories":[
         "Watches",
         "Eyewear"
      ],
      "twitterHandle":"@tagheuer",
      "type":"Brand",
      "website":"http://www.tagheuer.com/",
	  'internalBrandName': 'Tag Heuer',
      'isActive': false
   }
) RETURNING *;
UPSERT INTO offer_catalogue (KEY, VALUE) VALUES ("brandIdCounter",
   3
) RETURNING *;

