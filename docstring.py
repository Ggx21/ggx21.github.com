import os
import re
from datetime import datetime

def add_docstring(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        content = file.read()

    # Check if the docstring already exists
    if re.search(r'^---[\s\S]+?---', content, re.MULTILINE):
        print(f"Docstring already exists in {file_path}")
        return

    # Extract relevant information from the file
    title_match = re.search(r'^title: (.+)', content, re.MULTILINE)
    title = title_match.group(1) if title_match else content[:10].strip()
    #去掉换行符
    title = title.replace('\n', '')
    #去掉空格
    title = title.replace(' ', '')
    title = title + '...'

    # set date time to last modified time
    date = datetime.fromtimestamp(os.path.getmtime(file_path)).strftime('%Y-%m-%d %H:%M:%S')

    #set tags to the path of the file
    tags = file_path.split('\\')[1:-1]
    print("file_path", file_path)
    print("tags", tags)

    #set categories to the path of the file
    categories = file_path.split('\\')[1:-1]

    # Create the docstring
    docstring = f'---\ntitle: {title}\ndate: {date}\ntags:\n    - {", ".join(tags)}\ncategories:\n    - {", ".join(categories)}\n---\n'

    # Add the docstring to the file
    with open(file_path, 'w', encoding='utf-8') as file:
        file.write(docstring + content)

    print(f"Docstring added to {file_path}")

def remove_docstring(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        content = file.read()

    # Remove existing docstring
    content = re.sub(r'^---[\s\S]+?---', '', content, flags=re.MULTILINE)

    # Write the content back to the file
    with open(file_path, 'w', encoding='utf-8') as file:
        file.write(content)

    print(f"Docstring removed from {file_path}")

def process_directory_add(directory):
    for root, _, files in os.walk(directory):
        for file_name in files:
            if file_name.endswith('.md'):
                file_path = os.path.join(root, file_name)
                add_docstring(file_path)

def process_directory_remove(directory):
    for root, _, files in os.walk(directory):
        for file_name in files:
            if file_name.endswith('.md'):
                file_path = os.path.join(root, file_name)
                remove_docstring(file_path)

if __name__ == "__main__":
    # Replace 'your_directory_path' with the path to your hexo blog directory
    blog_directory = '_posts'
    process_directory_add(blog_directory)
