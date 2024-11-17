import csv
import math

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
    """
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
    """
    data = parse_csv('data/combed.csv')
    new_data = []
    # replace the close value of each column with the index of the row
    c = 0
    for row in data:
        c += 0.05
        new_row = []
        for i in range(len(row)):
            if i == 4:
                new_row.append(1000*math.sin(c) + 1000)
            else:
                new_row.append(row[i])
        new_data.append(new_row)

    with open('data/sinWave.csv', 'w', newline='') as csvfile:
        writer = csv.writer(csvfile)
        writer.writerows(new_data)
    print('saved to data/raisingSlope.csv')
