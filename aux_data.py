flask_test_service ={
    "app_name": "flask_service",
    "port": "5000",
    "connect_DB": "yes",
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
    "app_name": "flask_app",
    "port": "5000",
    "cors": "yes",
    "connect_DB": "yes",
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
                "bp_2":[
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
                "bp_3":[
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
    "endpoints":[
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

express_test_service ={
        "app_name": "express_services",
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

express_test_app ={
        "app_name": "express_app",
        "port": "3000",
        "host": "localhost",
        "strict":"yes",
        "body_parser":"",
        "cors":"",
        "view_engine":"pug",
        "css_engine":"css",
        "config_file":"yes",
        "connect_DB":"",
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