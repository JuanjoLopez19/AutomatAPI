flask_test_service = {
    "app_name": "flaskServices",
    "port": "5000",
    "connect_DB": "yes",
    "db":"",
    "cors": "yes",
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
            "methods": {
                "get_m": "yes",
                "put": "yes",
                "post": "no",
                "delete": "no"
            }
        },
        {
            "endpoint_name": "prueba2",
            "endpoint_url": "/prueba2",
            "endpoint_comment": "This is a test endpoint",
            "methods": {
                "get_m": "yes",
                "put": "yes",
                "post": "no",
                "delete": "yes"
            }
        },
        {
            "endpoint_name": "prueba3",
            "endpoint_url": "/prueba3",
            "endpoint_comment": "This is a test endpoint",  
            "methods": {
                "get_m": "no",
                "put": "yes",
                "post": "no",
                "delete": "yes"
            }
        }
    ]
}

flask_test_app = {
    "app_name": "flaskApp",
    "port": "5000",
    "cors": "yes",
    "connect_DB": "yes",
    "db":{
        "db_host": "localhost",
        "db_type": "postgresql",
        "db_port": "123",
        "db_name": "prueba",
        "db_user": "pruebaUser",
        "db_pwd": "123qwe"
    },
    "table_name": "aux",
    "config_file": "yes",
    "type_config_file": "dev",
    "secret":"",
    "host": "0.0.0.0",
    "use_bp":"yes",
    "handle_404": "yes",
    "bp_list":{
        "list":[
            {
                "bp_1":[
                    {
                        "endpoint_name": "prueba1",
                        "endpoint_url": "/prueba1",
                        "endpoint_comment": "",
                        "methods": {
                            "get_m": "yes",
                            "put": "yes",
                            "post": "no",
                            "delete": "no",
                        } 
                    },
                    {
                        "endpoint_name": "prueba2",
                        "endpoint_url": "/prueba2",
                        "endpoint_comment": "This is a test endpoint",
                        "methods": {
                            "get_m": "yes",
                            "put": "yes",
                            "post": "no",
                            "delete": "yes"
                        }
                    },
                    {
                        "endpoint_name": "prueba3",
                        "endpoint_url": "/prueba3",
                        "endpoint_comment": "This is a test endpoint",
                        "methods": {
                             "get_m": "no",
                            "put": "yes",
                            "post": "no",
                            "delete": "yes"
                        }
                    }
                ],
            },
            {
                "bp_2":[
                    {
                        "endpoint_name": "prueba1",
                        "endpoint_url": "/prueba1",
                        "endpoint_comment": "",
                        "methods": {
                            "get_m": "yes",
                            "put": "yes",
                            "post": "no",
                            "delete": "no"
                        }
                    },
                    {
                        "endpoint_name": "prueba2",
                        "endpoint_url": "/prueba2",
                        "endpoint_comment": "This is a test endpoint",
                        "methods": {
                            "get_m": "yes",
                            "put": "yes",
                            "post": "no",
                            "delete": "yes"
                        }
                    },
                    {
                        "endpoint_name": "prueba3",
                        "endpoint_url": "/prueba3",
                        "endpoint_comment": "This is a test endpoint",
                        "methods": {
                            "get_m": "no",
                            "put": "yes",
                            "post": "no",
                            "delete": "yes"
                        }
                    },
                ]
            },
            {
                "bp_3":[
                    {
                        "endpoint_name": "prueba1",
                        "endpoint_url": "/prueba1",
                        "endpoint_comment": "",
                        "methods": {
                            "get_m": "yes",
                            "put": "yes",
                            "post": "no",
                            "delete": "no"
                        }  
                    },
                    {
                        "endpoint_name": "prueba2",
                        "endpoint_url": "/prueba2",
                        "endpoint_comment": "This is a test endpoint",
                        "methods": {
                            "get_m": "yes",
                            "put": "yes",
                            "post": "no",
                            "delete": "yes"
                        }
                    },
                    {
                        "endpoint_name": "prueba3",
                        "endpoint_url": "/prueba3",
                        "endpoint_comment": "This is a test endpoint",
                        "methods": {
                           "get_m": "no",
                            "put": "yes",
                            "post": "no",
                            "delete": "yes"
                        }
                    },
                ]
            }
        ],
    },
    "endpoints":[
        {
            "endpoint_name": "prueba1",
            "endpoint_url": "/prueba1",
            "endpoint_comment": "",
            "methods": {
                "get_m": "yes",
                "put": "yes",
                "post": "no",
                "delete": "no",
            } 
        },
        {
            "endpoint_name": "prueba2",
            "endpoint_url": "/prueba2",
            "endpoint_comment": "This is a test endpoint",
            "methods": {
                "get_m": "yes",
                "put": "yes",
                "post": "no",
                "delete": "yes",      
            } 
        },
        {
            "endpoint_name": "prueba3",
            "endpoint_url": "/prueba3",
            "endpoint_comment": "This is a test endpoint",
            "methods": {
                "get_m": "no",
                "put": "yes",
                "post": "no",
                "delete": "yes"
            }
        },
    ],
}

express_test_service = {
        "app_name": "expressServices",
        "port": "3000",
        "host": "localhost",
        "strict":"yes",
        "body_parser":"yes",
        "cors":"yes",
        "config_file":"yes",
        "connect_DB":"yes",
        "db":{
            "db_host": "localhost",
            "db_type": "postgres",
            "db_port": "123",
            "db_name": "prueba",
            "db_user": "pruebaUser",
            "db_pwd": "123qwe"
        },
        "use_controllers":"yes",
        "controllers_list":{
            "list":[
                {
                    "cont1":[
                        {
                            "endpoint_name": "prueba1",
                            "endpoint_url": "/prueba1",
                            "endpoint_comment":"Endpoint de prueba",
                            "method":"get",
                        },
                        {
                            "endpoint_name": "prueba2",
                            "endpoint_url": "/prueba2",
                            "endpoint_comment":"Endpoint de prueba",
                            "method":"delete",
                        },
                        {
                            "endpoint_name": "prueba3",
                            "endpoint_url": "/prueba3",
                            "endpoint_comment":"Endpoint de prueba",
                            "method":"get",
                        }
                    ]  
                },
                {
                    "cont2":[
                        {
                            "endpoint_name": "prueba1",
                            "endpoint_url": "/prueba1",
                            "endpoint_comment":"Endpoint de prueba",
                            "method":"get",
                        },
                        {
                            "endpoint_name": "prueba2",
                            "endpoint_url": "/prueba2",
                            "endpoint_comment":"Endpoint de prueba",
                            "method":"delete",
                        },
                        {
                            "endpoint_name": "prueba3",
                            "endpoint_url": "/prueba3",
                            "endpoint_comment":"Endpoint de prueba",
                            "method":"get",
                        }
                    ]   
                },
                {
                    "cont3":[
                        {
                            "endpoint_name": "prueba1",
                            "endpoint_url": "/prueba1",
                            "endpoint_comment":"Endpoint de prueba",
                            "method":"get",
                        },
                        {
                            "endpoint_name": "prueba2",
                            "endpoint_url": "/prueba2",
                            "endpoint_comment":"Endpoint de prueba",
                            "method":"delete",
                        },
                        {
                            "endpoint_name": "prueba3",
                            "endpoint_url": "/prueba3",
                            "endpoint_comment":"Endpoint de prueba",
                            "method":"get",
                        }
                    ]
                }
            ]
        },
        "endpoints":[
            {
                "endpoint_name": "prueba1",
                "endpoint_url": "/prueba1",
                "endpoint_comment":"Endpoint de prueba",
                "method":"get",
            },
            {
                "endpoint_name": "prueba2",
                "endpoint_url": "/prueba2",
                "endpoint_comment":"Endpoint de prueba",
                "method":"delete",
            },
            {
                "endpoint_name": "prueba3",
                "endpoint_url": "/prueba3",
                "endpoint_comment":"Endpoint de prueba",
                "method":"get",
            }
        ],
}

express_test_app = {
        "app_name": "expressApp",
        "port": "3000",
        "host": "localhost",
        "strict":"yes",
        "body_parser":"no",
        "cors":"no",
        "view_engine":"pug",
        "css_engine":"css",
        "config_file":"yes",
        "connect_DB":"no",
        "db":{
            "db_host": "localhost",
            "db_type": "postgres",
            "db_port": "123",
            "db_name": "prueba",
            "db_user": "pruebaUser",
            "db_pwd": "123qwe"
        },
        "use_controllers":"yes",
        "controllers_list":{
            "list":[
                {
                    "cont1":[
                        {
                            "endpoint_name": "prueba1",
                            "endpoint_url": "/prueba1",
                            "endpoint_comment":"Endpoint de prueba",
                            "method":"get",
                        },
                        {
                            "endpoint_name": "prueba2",
                            "endpoint_url": "/prueba2",
                            "endpoint_comment":"Endpoint de prueba",
                            "method":"delete",
                        },
                        {
                            "endpoint_name": "prueba3",
                            "endpoint_url": "/prueba3",
                            "endpoint_comment":"Endpoint de prueba",
                            "method":"get",
                        }
                    ]  
                },
                {
                    "cont2":[
                        {
                            "endpoint_name": "prueba1",
                            "endpoint_url": "/prueba1",
                            "endpoint_comment":"Endpoint de prueba",
                            "method":"get",
                        },
                        {
                            "endpoint_name": "prueba2",
                            "endpoint_url": "/prueba2",
                            "endpoint_comment":"Endpoint de prueba",
                            "method":"delete",
                        },
                        {
                            "endpoint_name": "prueba3",
                            "endpoint_url": "/prueba3",
                            "endpoint_comment":"Endpoint de prueba",
                            "method":"get",
                        }
                    ]   
                },
                {
                    "cont3":[
                        {
                            "endpoint_name": "prueba1",
                            "endpoint_url": "/prueba1",
                            "endpoint_comment":"Endpoint de prueba",
                            "method":"get",
                        },
                        {
                            "endpoint_name": "prueba2",
                            "endpoint_url": "/prueba2",
                            "endpoint_comment":"Endpoint de prueba",
                            "method":"delete",
                        },
                        {
                            "endpoint_name": "prueba3",
                            "endpoint_url": "/prueba3",
                            "endpoint_comment":"Endpoint de prueba",
                            "method":"get",
                        }
                    ]
                }
            ]
        },
        "endpoints":[
            {
                "endpoint_name": "prueba1",
                "endpoint_url": "/prueba1",
                "endpoint_comment":"Endpoint de prueba",
                "method":"get",
            },
            {
                "endpoint_name": "prueba2",
                "endpoint_url": "/prueba2",
                "endpoint_comment":"Endpoint de prueba",
                "method":"delete",
            },
            {
                "endpoint_name": "prueba3",
                "endpoint_url": "/prueba3",
                "endpoint_comment":"Endpoint de prueba",
                "method":"get",
            }
        ],
}

django_test_service = {
    "app_name": "djangoServices",
    "port": "8001",
    "host": "0.0.0.0",
    "language_code": "en-us",
    "admin_url": "yes",
    "admin_url_name": "admin",
    "web_browser": "yes",
    "web_browser_url": "firefox",
    "db":"",
    "endpoints":[
        {
            "endpoint_name": "endpoint1",
            "logged_in":"yes",
            "endpoint_url": "endpoint1",
            "endpoint_comment": "Comment for the endpoint 1",
            "methods":{
                "get_m": "yes",
                "put": "yes",
                "post": "no",
                "delete": "no"
            },
        },
        {
            "endpoint_name": "endpoint2",
            "logged_in":"no",
            "endpoint_url": "endpoint2",
            "endpoint_comment": "Comment for the endpoint 2",
            "methods":{
                "get_m": "no",
                "put": "yes",
                "post": "no",
                "delete": "yes"
            },
        },
        {
            "endpoint_name": "endpoint3",
            "logged_in":"yes",
            "endpoint_url": "endpoint3",
            "endpoint_comment": "Comment for the endpoint 3",
            "methods":{
                "get_m": "no",
                "put": "no",
                "post": "yes",
                "delete": "no"
            },
        },
    ],
    "sub_apps":{
        "apps":[
            {
                "sub_app1":{
                    "subapp_name": "",
                    "middleware":"sub_app1",
                    "logged_in":"yes",
                    "model":{
                        "model_name":"app1",
                        "model_fields":[
                            {"name":"fiedl1","type":"Integer","null":"True","blank":"True","default":"1"},
                            {"name":"field2","type":"Boolean","null":"False","blank":"True","default":"11-12-2001"},
                            {"name":"field3","type":"URL","null":"False","blank":"False","default":"usuario"}
                        ]
				    },
                    "endpoint_name": "app1",
                    "methods":{
                        "get_m":"yes",
                        "post":"yes",
                        "put":"yes",
                        "delete":"yes"
                    },
                },
                "sub_app2":{
                    "subapp_name": "",
                    "middleware":"sub_app2",
                    "logged_in":"yes",
                    "model":{
                        "model_name":"app2",
                        "model_fields":[
                            {"name":"fiedl1","type":"Integer","null":"True","blank":"True","default":"1"},
                            {"name":"field2","type":"Boolean","null":"False","blank":"True","default":"11-12-2001"},
                            {"name":"field3","type":"URL","null":"False","blank":"False","default":"usuario"}
                        ]
				    },
                    "endpoint_name": "app2",
                    "methods":{
                        "get_m":"no",
                        "post":"yes",
                        "put":"yes",
                        "delete":"no"
                    },
                },
                "sub_app3":{
                    "subapp_name": "",
                    "middleware":"sub_app3",
                    "logged_in":"no",
                    "model":{
                        "model_name":"app3",
                        "model_fields":[
                            {"name":"fiedl1","type":"Integer","null":"True","blank":"True","default":"1"},
                            {"name":"field2","type":"Boolean","null":"False","blank":"True","default":"11-12-2001"},
                            {"name":"field3","type":"URL","null":"False","blank":"False","default":"usuario"}
                        ]
				    },
                    "endpoint_name": "app3",
                    "methods":{
                        "get_m":"yes",
                        "post":"yes",
                        "put":"no",
                        "delete":"no"
                    },
                }
            }
        ]
    }
}

django_test_app = {
    "app_name": "djangoApp",
    "port": "8001",
    "host": "0.0.0.0",
    "language_code": "en-us",
    "admin_url": "yes",
    "admin_url_name": "admin",
    "web_browser": "yes",
    "web_browser_url": "firefox",
    "db":"",
    "endpoints":[
        {
            "endpoint_name": "endpoint1",
            "logged_in":"yes",
            "endpoint_url": "endpoint1",
            "endpoint_comment": "Comment for the endpoint 1",
            "methods":{
                "get_m": "yes",
                "put": "yes",
                "post": "no",
                "delete": "no"
            },
        },
        {
            "endpoint_name": "endpoint2",
            "logged_in":"no",
            "endpoint_url": "endpoint2",
            "endpoint_comment": "Comment for the endpoint 2",
            "methods":{
                "get_m": "no",
                "put": "yes",
                "post": "no",
                "delete": "yes"
            },
        },
        {
            "endpoint_name": "endpoint3",
            "logged_in":"yes",
            "endpoint_url": "endpoint3",
            "endpoint_comment": "Comment for the endpoint 3",
            "methods":{
                "get_m": "no",
                "put": "no",
                "post": "yes",
                "delete": "no"
            },
        },
    ],
    "sub_apps":{
        "apps":[
            {
                "sub_app1":{
                    "subapp_name": "",
                    "middleware":"sub_app1",
                    "logged_in":"yes",
                    "model_editable":"yes",
                    "model":{
                        "model_name":"app1",
                        "model_fields":[
                            {"name":"fiedl1","type":"Integer","null":"True","blank":"True","default":"1"},
                            {"name":"field2","type":"Boolean","null":"False","blank":"True","default":"11-12-2001"},
                            {"name":"field3","type":"URL","null":"False","blank":"False","default":"usuario"}
                        ]
				    },
                    "endpoint_name": "endpoint1",
                    "methods":{
                        "get_m":"yes",
                        "post":"yes",
                        "put":"yes",
                        "delete":"yes"
                    },
                },
                "sub_app2":{
                    "subapp_name": "",
                    "middleware":"sub_app2",
                    "logged_in":"yes",
                    "model_editable":"no",
                    "model":{
                        "model_name":"app2",
                        "model_fields":[
                            {"name":"fiedl1","type":"Integer","null":"True","blank":"True","default":"1"},
                            {"name":"field2","type":"Boolean","null":"False","blank":"True","default":"11-12-2001"},
                            {"name":"field3","type":"URL","null":"False","blank":"False","default":"usuario"}
                        ]
				    },
                    "endpoint_name": "endpoint2",
                    "methods":{
                        "get_m":"no",
                        "post":"yes",
                        "put":"yes",
                        "delete":"no"
                    },
                },
                "sub_app3":{
                    "subapp_name": "",
                    "middleware":"sub_app3",
                    "logged_in":"no",
                    "model_editable":"yes",
                    "model":{
                        "model_name":"app3",
                        "model_fields":[
                            {"name":"fiedl1","type":"Integer","null":"True","blank":"True","default":"1"},
                            {"name":"field2","type":"Boolean","null":"False","blank":"True","default":"11-12-2001"},
                            {"name":"field3","type":"URL","null":"False","blank":"False","default":"usuario"}
                        ]
				    },
                    "endpoint_name": "endpoint3",
                    "methods":{
                        "get_m":"yes",
                        "post":"yes",
                        "put":"no",
                        "delete":"no"
                    },
                }
            }
        ]
    }
}