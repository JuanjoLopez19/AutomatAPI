
class {{cookiecutter.endpoint_name | capitalize}}(APIView):
    '''
        {{cookiecutter.endpoint_name | capitalize}} endpoint
        {{cookiecutter.endpoint_comment}}
    '''
    {%- if cookiecutter.logged_in == "yes" %}
    # Add permission to check only if authenticated 
    permission_classes = [permissions.IsAuthenticated]
    {% endif %}
    {%- if cookiecutter.methods.get_m == "yes" %}
    def get(self, request, *args, **kwargs):
       return Response({'res': 'get method'}, status=status.HTTP_200_OK)
    {%- endif %}
    {%- if cookiecutter.methods.post == "yes" %}
    def post(self, request, *args, **kwargs):
        return Response({'res': 'post method'}, status=status.HTTP_200_OK)
    {%- endif %}
    {%- if cookiecutter.methods.put == "yes" %}
    def put(self, request, *args, **kwargs):
        return Response({'res': 'put method'}, status=status.HTTP_200_OK)
    {%- endif %}
    {%- if cookiecutter.methods.delete == "yes" %}
    def delete(self, request, *args, **kwargs):
        return Response({'res': 'delete method'}, status=status.HTTP_200_OK)
    {%- endif %}