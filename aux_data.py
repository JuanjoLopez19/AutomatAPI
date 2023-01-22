DEFAULT_CONFIG = {
    'cookiecutter':{
        'tecnology_args':{
            'flask':{
                'services':{
                    'app_name': '',
                    'port': '',
                    'connect_DB': '',
                    'table_name': '',
                    'config_file': '',
                    'type_config_file': '',
                    'secret':'',
                    'host': '',
                    'endpoints':[],
                    'template_path': './Templates/flask/services',
                },
                'app_web':{
                    'app_name': '',
                    'port': '',
                    'connect_DB': '',
                    'table_name': '',
                    'config_file': '',
                    'type_config_file': '',
                    'secret':'',
                    'host': '',
                    'use_bp': '',
                    'bp_list':'',
                    'handle_404': '',
                    'endpoints':[],
                    'template_path': './Templates/flask/app_web',
                },  
            },
            'express':{
                'services':{},
                'app_web':{},
            },
            'django':{
                'services':{},
                'app_web':{},
            },
        },
        'endpoints_args':{
            'flask':{
                "endpoint_name": "endpoint",
                "endpoint_url": "/endpoint",
                "bp_name": "",
                "endpoint_comment": "",
                "get": "yes",
                "put": "no",
                "post": "no",
                "delete": "no",
                'template_path': './Templates/endpoints/flask',
            },
            'express':{
                "endpoint_name": "endpoint",
                "endpoint_url": "/endpoint",
                "method":["get","post","put","delete"],
                'template_path': './Templates/endpoints/express',
            },
            'django':{
                'template_path': './Templates/endpoints/django',
            },
        },
        'aux_stuff':{
            'flask_app_run_path': './Templates/flask/aux_stuff/app_run',
            'output_path': './temp_templates/',
            'blueprints': './Templates/flask/aux_stuff/blueprints',
        }
    }
}


flask_test_serv ={
    "app_name": "prueba",
    "port": "5000",
    "connect_DB": "yes",
    "table_name": "aux",
    "config_file": "yes",
    "type_config_file": "dev",
    "secret":"",
    "host": "0.0.0.0",
    "endpoints":[
        {
            "endpoint_name": "prueba1",
            "endpoint_url": "/prueba1",
            "endpoint_comment": "",
            "get": "yes",
            "put": "yes",
            "post": "no",
            "delete": "no"
        },
        {
            "endpoint_name": "prueba2",
            "endpoint_url": "/prueba2",
            "endpoint_comment": "This is a test endpoint",
            "get": "yes",
            "put": "yes",
            "post": "no",
            "delete": "yes"
        },
        {
            "endpoint_name": "prueba3",
            "endpoint_url": "/prueba3",
            "endpoint_comment": "This is a test endpoint",
            "get": "no",
            "put": "yes",
            "post": "no",
            "delete": "yes"
        }
    ]
}


flask_test_app ={
    'app_name': 'prueba',
    'port': '5000',
    'connect_DB': 'yes',
    'table_name': 'aux',
    'config_file': 'yes',
    'type_config_file': 'dev',
    'secret':'',
    'host': '0.0.0.0',
    'use_bp':'yes',
    'handle_404': 'yes',
    'bp_list':{
        'list':[
            {
                'bp_1':[
                    {
                        "endpoint_name": "prueba1",
                        "endpoint_url": "/prueba1",
                        "endpoint_comment": "",
                        "get": "yes",
                        "put": "yes",
                        "post": "no",
                        "delete": "no",
                    },
                    {
                        "endpoint_name": "prueba2",
                        "endpoint_url": "/prueba2",
                        "endpoint_comment": "This is a test endpoint",
                        "get": "yes",
                        "put": "yes",
                        "post": "no",
                        "delete": "yes",
                    },
                    {
                        "endpoint_name": "prueba3",
                        "endpoint_url": "/prueba3",
                        "endpoint_comment": "This is a test endpoint",
                        "get": "no",
                        "put": "yes",
                        "post": "no",
                        "delete": "yes",
                    }
                ],
            },
            {
                'bp_2':[
                    {
                        "endpoint_name": "prueba1",
                        "endpoint_url": "/prueba1",
                        "endpoint_comment": "",
                        "get": "yes",
                        "put": "yes",
                        "post": "no",
                        "delete": "no",
                    },
                    {
                        "endpoint_name": "prueba2",
                        "endpoint_url": "/prueba2",
                        "endpoint_comment": "This is a test endpoint",
                        "get": "yes",
                        "put": "yes",
                        "post": "no",
                        "delete": "yes",
                    },
                    {
                        "endpoint_name": "prueba3",
                        "endpoint_url": "/prueba3",
                        "endpoint_comment": "This is a test endpoint",
                        "get": "no",
                        "put": "yes",
                        "post": "no",
                        "delete": "yes",
                    },
                ]
            },
            {
                'bp_3':[
                    {
                        "endpoint_name": "prueba1",
                        "endpoint_url": "/prueba1",
                        "endpoint_comment": "",
                        "get": "yes",
                        "put": "yes",
                        "post": "no",
                        "delete": "no",
                    },
                    {
                        "endpoint_name": "prueba2",
                        "endpoint_url": "/prueba2",
                        "endpoint_comment": "This is a test endpoint",
                        "get": "yes",
                        "put": "yes",
                        "post": "no",
                        "delete": "yes",
                    },
                    {
                        "endpoint_name": "prueba3",
                        "endpoint_url": "/prueba3",
                        "endpoint_comment": "This is a test endpoint",
                        "get": "no",
                        "put": "yes",
                        "post": "no",
                        "delete": "yes",
                    },
                ]
            }
        ],
    },
    'endpoints':[
        {
            "endpoint_name": "prueba1",
            "endpoint_url": "/prueba1",
            "endpoint_comment": "",
            "get": "yes",
            "put": "yes",
            "post": "no",
            "delete": "no",
        },
        {
            "endpoint_name": "prueba2",
            "endpoint_url": "/prueba2",
            "endpoint_comment": "This is a test endpoint",
            "get": "yes",
            "put": "yes",
            "post": "no",
            "delete": "yes",
        },
        {
            "endpoint_name": "prueba3",
            "endpoint_url": "/prueba3",
            "endpoint_comment": "This is a test endpoint",
            "get": "no",
            "put": "yes",
            "post": "no",
            "delete": "yes",
        },
    ],
}