from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import permissions
from .models import {{cookiecutter.model.model_name}}
from .serializers import {{cookiecutter.model.model_name}}Seralizer

# Create your views here.

class TodoListApiView(APIView):
    # Add permission to check only if authenticated --> Posible param
    permission_classes = [permissions.IsAuthenticated]

    # 1. list all --> Get Method
    def get(self,request, *args, **kwargs):
        '''
            List all the todo items for the requested user
        '''
        
        todos = Todo.objects.filter(user = request.user.id)
        serializer = TodoSeralizer(todos, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # 2. Create --> Post method
    def post(self, request, *args, **kwargs):
        '''
            Create Todo item with given data
        '''

        data = {
            'task': request.data.get('task'),
            'completed': request.data.get('completed'),
            'user': request.user.id
        }

        serializer = TodoSeralizer(data=data)   
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class TodoDetailApiView(APIView):
    # Add permission to check only if authenticated --> Posible param
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self, todo_id, user_id):
        '''
            Helper method to get the object with given todo_id and user_id
        '''
        try:    
            return Todo.objects.get(id=todo_id, user=user_id)
        except Todo.DoesNotExist:
            return None

    def get(self,request,todo, *args, **kwargs):
        '''
            Retrives the Todo with the given id
        '''

        todo_instance = self.get_object(todo, request.user.id)
        if not todo_instance:
            return Response(
                {"res": "Object with todo id does not exist"},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = TodoSeralizer(todo_instance)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, todo_id, *args, **kwargs):
        '''
            Updates the todo item with given todo_id if exists
        '''
        todo_instance = self.get_object(todo_id, request.user.id)
        if not todo_instance:
            return Response(
                {"res": "Object with todo id does not exists"}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        data = {
            'task': request.data.get('task'),
            'completed': request.data.get('completed'), 
            'user': request.user.id
        }
        serializer = TodoSeralizer(instance = todo_instance, data=data, partial = True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # 5. Delete
    def delete(self, request, todo_id, *args, **kwargs):
        '''
        Deletes the todo item with given todo_id if exists
        '''
        todo_instance = self.get_object(todo_id, request.user.id)
        if not todo_instance:
            return Response(
                {"res": "Object with todo id does not exists"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        todo_instance.delete()
        return Response(
            {"res": "Object deleted!"},
            status=status.HTTP_200_OK
        )