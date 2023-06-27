from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import permissions
from .models import {{cookiecutter.model.model_name|capitalize}}
from .serializers import {{cookiecutter.model.model_name|capitalize}}Seralizer

# Create your views here.
{%- if cookiecutter.methods.get_m == "True" or cookiecutter.methods.post == "True" %}
class {{cookiecutter.model.model_name|capitalize}}View(APIView):
    {%- if cookiecutter.logged_in == "yes" %}
    # Add permission to check only if authenticated 
    permission_classes = [permissions.IsAuthenticated]
    {% endif %}
    {%- if cookiecutter.methods.get_m == "yes" %}
    # 1. list all --> Get Method
    def get(self,request, *args, **kwargs):
        '''
            List all the {{cookiecutter.model.model_name}} items for the requested user
        '''
        
        {{cookiecutter.model.model_name}}_list = {{cookiecutter.model.model_name|capitalize}}.objects.filter(user = request.user.id)
        serializer = {{cookiecutter.model.model_name|capitalize}}Seralizer({{cookiecutter.model.model_name}}_list, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    {%- endif %}
    {% if cookiecutter.methods.post == "True" %}
    # 2. Create --> Post method
    def post(self, request, *args, **kwargs):
        '''
            Create {{cookiecutter.model.model_name|capitalize}} item with given data
        '''

        data = {
            {%- for field in cookiecutter.model.model_fields %}
            '{{field['name']}}': request.data.get('{{field['name']}}'),
            {%- endfor %}
            'user': request.user.id
        }

        serializer = {{cookiecutter.model.model_name|capitalize}}Seralizer(data=data)   
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    {%- endif %}
{%- endif %}
{% if cookiecutter.methods.put == "True" or cookiecutter.methods.delete == "True" %}
class {{cookiecutter.model.model_name|capitalize}}DetailView(APIView):
    {%- if cookiecutter.logged_in == "yes" %}
    # Add permission to check only if authenticated 
    permission_classes = [permissions.IsAuthenticated]
    {%- endif %}

    def get_object(self, {{cookiecutter.model.model_name}}_id, user_id):
        '''
            Helper method to get the object with given {{cookiecutter.model.model_name}}_id and user_id
        '''
        try:    
            return {{cookiecutter.model.model_name|capitalize}}.objects.get(id={{cookiecutter.model.model_name}}_id, user=user_id)
        except {{cookiecutter.model.model_name|capitalize}}.DoesNotExist:
            return None

    def get(self,request,{{cookiecutter.model.model_name}}_id, *args, **kwargs):
        '''
            Retrives the {{cookiecutter.model.model_name}}_id with the given id
        '''

        {{cookiecutter.model.model_name}}_instance = self.get_object({{cookiecutter.model.model_name}}_id, request.user.id)
        if not {{cookiecutter.model.model_name}}_instance:
            return Response(
                {"res": "Object with {{cookiecutter.model.model_name}}_id does not exist"},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = {{cookiecutter.model.model_name|capitalize}}Seralizer({{cookiecutter.model.model_name}}_instance)
        return Response(serializer.data, status=status.HTTP_200_OK)
    {% if cookiecutter.methods.put == "True" %}
    def put(self, request, {{cookiecutter.model.model_name}}_id, *args, **kwargs):
        '''
            Updates the {{cookiecutter.model.model_name}} item with given {{cookiecutter.model.model_name}}_id if exists
        '''
        {{cookiecutter.model.model_name}}_instance = self.get_object({{cookiecutter.model.model_name}}_id, request.user.id)
        if not {{cookiecutter.model.model_name}}_instance:
            return Response(
                {"res": "Object with {{cookiecutter.model.model_name}}_id does not exists"}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        data = {
            {%- for field in cookiecutter.model.model_fields %}
            '{{field['name']}}': request.data.get('{{field['name']}}'),
            {%- endfor %} 
            'user': request.user.id
        }
        serializer = {{cookiecutter.model.model_name|capitalize}}Seralizer(instance = {{cookiecutter.model.model_name}}_instance, data=data, partial = True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    {%- endif %}
    {% if cookiecutter.methods.delete == "True" %}
    # 5. Delete
    def delete(self, request, {{cookiecutter.model.model_name}}_id, *args, **kwargs):
        '''
        Deletes the {{cookiecutter.model.model_name}} item with given {{cookiecutter.model.model_name}}_id if exists
        '''
        {{cookiecutter.model.model_name}}_instance = self.get_object({{cookiecutter.model.model_name}}_id, request.user.id)
        if not {{cookiecutter.model.model_name}}_instance:
            return Response(
                {"res": "Object with {{cookiecutter.model.model_name}}_id does not exists"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        {{cookiecutter.model.model_name}}_instance.delete()
        return Response(
            {"res": "Object deleted!"},
            status=status.HTTP_200_OK
        )
    {%- endif %}
{%- endif %}