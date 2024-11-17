import csv

data = []

def parse_csv(file):
    with open(file, newline='') as csvfile:
        data = list(csv.reader(csvfile))
    return data

# find all csv files in the data folder
def find_csv_files():
    import os
    path = 'data'
    files = []
    for file in os.listdir(path):
        if file.endswith('.csv'):
            files.append(path + '/' + file)
    return files

if __name__ == '__main__':
    files = find_csv_files()
    for file in files:
        data += parse_csv(file)
    new_data = []
    c=0
    for row in data:
        if not c:
            new_data.append(row)
        c+=1
        c%=10
    with open('data/combed.csv', 'w', newline='') as csvfile:
        writer = csv.writer(csvfile)
        writer.writerows(new_data)
    print('Data combined, combed and saved to data/combed.csv')
