'use strict';

const _ = require('lodash');
const loader = require('../../lib/loader');

const BILLING_ENV = process.env.BILLING_ENV ? process.env.BILLING_ENV : 'testing';
const ACCOUNTS_ENV = process.env.ACCOUNTS_ENV ? process.env.ACCOUNTS_ENV : 'testing';

const BILLING_AFTERSHIP = BILLING_ENV === 'development' ? 'http://localhost:7203' : 'https://billing.aftership.io';
const ACCOUNTS_AFTERSHIP = ACCOUNTS_ENV === 'development' ? 'http://localhost:7004' : 'https://accounts.aftership.io';

const redis_util = require('../redis_util');

let config = {
	api_version: 'v4',
	redis_local_config: {
		api: {
			host: 'dev.aftership.net',
			port: 6379,
			db: 3,
			reconnectOnError: redis_util.reconnectOnError,
			retryStrategy: redis_util.retryStrategy
		},
		logger: {
			port: 6379,
			host: 'redis-master.aftership.net',
			db: 15,
			reconnectOnError: redis_util.reconnectOnError,
			retryStrategy: redis_util.retryStrategy
		},
		subscriptions_aws: {
			host: 'dev.aftership.net',
			port: 6379,
			db: 14,
			reconnectOnError: redis_util.reconnectOnError,
			retryStrategy: redis_util.retryStrategy
		},
		app_connection_credentials: {
			host: 'dev.aftership.net',
			port: 6379,
			db: 8,
			reconnectOnError: redis_util.reconnectOnError,
			retryStrategy: redis_util.retryStrategy
		}
	},
	port: 3001,
	ssl_rate_limit: {
		limit: 600,
		duration: 3600
	},
	rate_limit: {
		duration: 60,
		duration_sec: 1,
		default_api_rate_limit: 600, // by default average 10 calls per seconds (600 req / min)
		default_api_rate_limit_sec: 2
	},
	user_rate_limit: {
		default_rate_limit: 120,
		premium_rate_limit: 600
	},
	user_rate_limit_sec: {
		default_rate_limit: 2,
		premium_rate_limit: 10
	},
	new_free_user_setting: {
		unlimited_plan: {
			plan_id: 'AS_UNLIMITED_FREE_2020JUN'
		},
		free_trial_plan: {
			plan_id: 'AS_TRIAL',
			rate_limit: {
				duration: 86400,
				api_rate_limit: 100
			},
			limit_redis_key_prefix: 'new_free_user:'
		}
	},
	export_csv: {
		rejected_plans: ['AS_UNLIMITED_FREE_2020JUN']
	},
	api_key: {
		default_label: 'default'
	},
	cache: {
		api_key: {
			prefix_v1: 'api_key:v1:',
			prefix: 'api_key:v4:',
			ttl: 86400,
			memory_cache_ttl: 60
		}
	},
	spanner_db: {
		projectId: 'aftership-test',
		instance: 'aftership-test-1',
		database: 'aftership-api-testing'
	},
	beanstalk: {
		tube: [
			{
				tube_name: 'utility_csv-importer',
				host: 'dev.aftership.net',
				port: '11300'
			},
			{
				tube_name: 'utility_export_shipment',
				host: 'dev.aftership.net',
				port: '11300'
			},
			{
				tube_name: 'utility_export_shipment_v2',
				host: 'dev.aftership.net',
				port: '11300'
			},
			{
				tube_name: 'connector_csv-autofetch',
				host: 'dev.aftership.net',
				port: 11300
			}
		]
	},
	p3p: 'CP="AfterShip does not have a P3P policy. Learn why here: https://www.aftership.com/p3p"',
	trackings: {
		max_per_page: 200,
		per_page: 100,
		max_nbHits: 1000000,
		day_range: 30,
		max_per_page_export: 50,
		per_page_export: 20,
		minimum_required_length: 2,
		maximum_allowed_length: 100,
		max_search_length: 60,
		max_per_page_private: 1000,
		per_page_private: 100,
		// track site feature, for /v4/admin/trackings/subscriptions
		max_subscription_email_sms_length: 2,
		max_subscription_messenger_length: 3
	},
	index_algolia_fields: [
		'created_at',
		'custom_fields',
		'customer_name',
		'delivery_time',
		'destination_country_iso3',
		'destination_courier_id',
		'emails',
		'index_updated_at',
		'order_id',
		'origin_country_iso3',
		'origin_courier_id',
		'smses',
		'tag',
		'title',
		'tracking_number',
		'user_id',
		'checkpoints',
		'active',
		'subscribed_smses',
		'subscribed_emails',
		'return_to_sender',
		'subtag',
		'source',
		'shipping_method',
		'courier_destination_country_iso3'
	],
	deployment: {
		crawler: {
			reserve_health_threshold: 60,
			report_health_threshold: 60,
			number_of_machines: 3
		},
		connector: {
			reserve_health_threshold: 60,
			report_health_threshold: 60,
			number_of_machines: 8
		}
	},
	beanstalk_console: {
		url: 'uti.aftership.com/beanstalk/public/index.php?',
		username: 'aftership',
		password: 'Startup852!'
	},
	admin_settings: {
		default_theme_id: '56c2fc918a5f64fbbe463841',
		default_theme_settings: {
			primary_font: 'Avenir Next',
			secondary_font: 'Lato',
			primary_color: '#3b73af',
			lookup_options: {
				order_number: false,
				tracking_number: true
			}
		}
	},
	payments: {
		top_up_amounts: [20, 30, 50, 100, 200, 500, 1000],
		blacklist_alert_email: 'bossa@aftership.com'
	},
	custom_domain: {
		cname: 'domains.aftership.io'
	},
	services: {
		billing: {
			base_url: BILLING_AFTERSHIP
		},
		accounts: {
			base_url: ACCOUNTS_AFTERSHIP
		},
		new_billing: {
			base_url: 'https://release-incy-platform.automizelyapi.io',
			gateway_id: 'b87955c50ab8444daaf761e70edb52e8'
		}
	},
	sqs: {
		region: 'us-west-2',
		apiVersion: '2012-11-05',
		create_notification: {
			delaySeconds: 0,
			queueUrl: 'https://sqs.us-west-2.amazonaws.com/734832810553/sqs_dev_create-notification_us-west-2'
		},
		create_tracking: {
			delaySeconds: 0,
			queueUrl: 'https://sqs.us-west-2.amazonaws.com/734832810553/sqs_dev_create-tracking_us-west-2'
		},
		delete_tracking: {
			delaySeconds: 0,
			queueUrl: 'https://sqs.us-west-2.amazonaws.com/734832810553/sqs_dev_api-delete-tracking-pubsub_uswe2'
		},
		create_user: {
			delaySeconds: 0,
			queueUrl: 'https://sqs.us-west-2.amazonaws.com/734832810553/sqs_dev_create-user_us-west-2'
		},
		update_sms: {
			delaySeconds: 300,
			queueUrl: 'https://sqs.us-west-2.amazonaws.com/734832810553/sqs_dev_update-sms_us-west-2'
		},
		update_webhook: {
			delaySeconds: 0,
			queueUrl: 'https://sqs.us-west-2.amazonaws.com/734832810553/sqs_dev_update-webhook_uswe2'
		},
		refresh_facebook: {
			delaySeconds: 0,
			queueUrl: 'https://sqs.us-west-2.amazonaws.com/734832810553/sqs_dev_refresh-facebook-app-connection_us-west-2'
		},
		sync_mongo_users_to_pubsub: {
			delaySeconds: 0,
			queueUrl: 'https://sqs.us-west-2.amazonaws.com/734832810553/sqs_dev_sync-mongo-users-to-pubsub_uswe2'
		}
	},
	pubsub: {
		aftership_event: 'projects/aftership-test/topics/aftership-test-events-v1'
	},
	cloudflare: {
		zone_id: 'a5b4e7990013a0d7e446b21f9423c5f2'
	},
	core_aftershipapi_com: {
		// url: 'http://localhost:9003'
		url: 'https://core.aftershipapi.io'
	},
	couriers_detections_aftershipapi_com: {
		url: 'https://couriers-detections.aftershipapi.io'
	},
	sso: {
		url: 'https://platform.automizelyapi.io'
	},
	data_automizelyapi_com: {
		url: 'https://data.automizelyapi.io'
	},
	account_automizelyapi_com: {
		url: 'https://release-incy-platform.automizelyapi.io'
	},
	couriers_data_aftershipapi_com: {
		url: 'https://couriers-data.aftershipapi.io'
	},
	notifications_aftershipapi_com: {
		url: 'https://notifications.aftershipapi.io'
	},
	product_automizelyapi_com: {
		url: 'https://product.automizelyapi.io'
	},
	master_user_uuid: 'ba8e4a5d49fb4fe0991da71868390eac',
	organizations_aftershipapi_com: {
		url: 'https://organizations.aftershipapi.io'
	},
	courier_app_slugs: [
		'expeditors-api-ref',
		'packs',
		'ceva-tracking',
		'spectran',
		'urgent-cargus',
		'ecom-express',
		'xpedigo',
		'tourline-reference',
		'directfreight-au-ref',
		'dao365',
		'ydh-express',
		'international-seur-api',
		'legion-express',
		'pioneer-logistics',
		'amazon-fba-us',
		'jne-api',
		'hsm-global',
		'sprint-pack',
		'dms-matrix',
		'fitzmark-api',
		'livrapide',
		'mazet',
		'dx-b2b-connum',
		'correosexpress-api',
		'nowlog-api',
		'dnj-express',
		'homelogistics',
		'mondialrelay-es',
		'purolator-international',
		'shippify',
		'ntl',
		'mondialrelay-fr',
		'relaiscolis',
		'fetchr',
		'mail-box-etc',
		'expeditors-api',
		'australia-post-api',
		'fan',
		'inexpost',
		'speedy',
		'sic-teliway',
		'cbl-logistica-api',
		'naqel-express',
		'bpost-api',
		'air-canada',
		'cdldelivers',
		'99minutos',
		'shipa',
		'barqexp',
		'fxtran',
		'redjepakketje',
		'ppl',
		'vox',
		'ups-api',
		'dhl-global-forwarding-api',
		'tipsa-ref',
		'polarspeed',
		'brt-it-api',
		'tipsa-api',
		'reimaginedelivery',
		'usps-api',
		'geodis-api',
		'posti-api',
		'jd-express',
		'dhl-global-mail-api',
		'passportshipping',
		'homerunner',
		'thijs-nl',
		'lbcexpress-api',
		'marken',
		'tnt-fr-reference',
		'olistpax',
		'jbhunt'
	],
	aftership_app_slugs: [
		'messenger',
		'csv-autofetch'
	],
	csv_import: {
		s3: {
			region: 'ap-southeast-1',
			bucket: 'aftership-import-csv-testing'
		},
		csv_path: 'uploads/csv/'
	},
	// need get from s3
	proxy: {
		webhook: {}
	}
};

let configs = loader.load(__dirname + '/../includes');
for (let key of Object.keys(configs)) {
	config = _.merge(config, configs[key]);
}

module.exports = config;
