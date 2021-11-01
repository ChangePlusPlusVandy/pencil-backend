sudo mysql --user=root  <<EOF
CREATE DATABASE pencildb;
CREATE USER 'root'@'localhost' IDENTIFIED BY 'rot';
GRANT ALL PRIVILEGES ON root.* TO 'root'@'localhost' WITH GRANT OPTION;
EOF

