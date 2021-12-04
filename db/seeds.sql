INSERT INTO department
  (name)
VALUES
 ('Human Resources'),
 ('Engineering'),
 ('Sales');

INSERT INTO role
  (title, salary, department_id)
VALUES
  ('Web Devloper', 125000, 2),
  ('Salesman', 55000, 3),
  ('Department Head', 100000, 1),
  ('Engineering Manager', 150000, 2),
  ('Sales Manager', 80000, 3);

INSERT INTO employee
  (first_name, last_name, role_id, manager_id)
VALUES
  ('Bob', 'Smith', 4, 1),
  ('Travis', 'Helms', 1, 1),
  ('Bryan', 'Minnoch', 3, 3),
  ('Kathryn', 'Helms', 5, 4);

  