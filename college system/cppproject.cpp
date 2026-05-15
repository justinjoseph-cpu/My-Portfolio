#include <iostream>
#include <fstream>
#include <unordered_map>
#include <string>
using namespace std;

struct Student {
    string name;
    unordered_map<string, unordered_map<string,int>> courses;
};

unordered_map<int, Student> students;

string clean(string s)
{
    if(s.size() >= 4 && s.substr(s.size() - 4) == ".txt")
        s = s.substr(0, s.size() - 4);
    return s;
}

void loadStudents()
{
    int op;
    cout << "1- Manual"<<endl<<"2- Enter File"<<endl;
    cout<<"Choice: ";
    cin >> op;

    if(op == 1)
    {
        int id;
        string name;

        cout << "ID: ";
        cin >> id;

        cin.ignore();

        cout << "Name: ";
        getline(cin, name);

        if(!students.count(id))
            students[id] = {name};
        else
            students[id].name = name;
    }
    else
    {
        string file;

        cout << "File name: ";
        cin >> file;

        ifstream in(file);

        int id;
        string name;

        while(in >> id)
        {
            getline(in, name);

            if(name.size() && name[0] == ' ')
                name = name.substr(1);

            else if(!students.count(id))
                students[id] = {name};

            else if(students[id].name.empty())
                students[id].name = name;
        }
    }
}

void loadExam()
{
    string subject, category;

    cout << "Enter subject name: "<<endl;
    cin >> subject;

    subject = clean(subject);

    cout << "Enter grade category (Mid/Quiz/Final): ";
    cin >> category;
    int op;

    cout << "1- Manual"<<endl<<"2- Enter File"<<endl;
    cout<<"Choice: ";
    cin >> op;

    if(op == 1)
    {
        int id;
        int grade;

        cout << "ID: ";
        cin >> id;

        cout << "Grade: ";
        cin >> grade;

        if(!students.count(id))
            students[id] = {"Unknown"};

        students[id].courses[subject][category] = grade;
    }
    else
    {
        string file;
        int id;

        cout << "File name: ";
        cin >> file;

        ifstream in(file);

        int grade;

        while(in >> id >> grade)
        {
            if(!students.count(id))
                students[id] = {"Unknown"};

            students[id].courses[subject][category] = grade;
        }
    }
}

void show()
{
    for(auto &student : students)
    {
        cout << "ID: "<<endl << student.first << " Name: " << student.second.name <<endl;

        for(auto &c : student.second.courses)
        {
            cout << "  " << c.first << ": "<<endl;

            for(auto &g : c.second)
                cout << "    " << g.first << " -> " << g.second << endl;
        }
    }
}

void searchStudent()
{
    int id;

    cout << "Enter ID: "<<endl;
    cin >> id;

    if(!students.count(id))
    {
        cout << "Student not found"<<endl;
        return;
    }

    auto &s = students[id];

    cout << "ID: " << id << " Name: " << s.name << endl;

    for(auto &c : s.courses)
    {
        cout << "  " << c.first << " :"<<endl;

        for(auto &g : c.second)
            cout << "    " << g.first << " -> " << g.second << endl;
    }
}

int main()
{
    int op;

    while(true)
    {
        cout << "1-Load Students"<<endl;
        cout << "2-Load Exam"<<endl;
        cout << "3-Show All"<<endl;
        cout << "4-Search Student"<<endl;
        cout << "5-Exit"<<endl;
        cout << "Choice:"<<endl;
        cin >> op;

        if(op == 1) loadStudents();
        else if(op == 2) loadExam();
        else if(op == 3) show();
        else if(op == 4) searchStudent();
        else break;
    }
}