import subprocess

# Set the path to the database on the device
device_db_path = "/data/data/com.lifelog/databases/ActivityLog.realm"

# Set the path to the destination on your PC
pc_db_path = "C:\\Users\\philk\\Projects\\LifeLog\\src\\utils\\db"

# Use adb to pull the database from the device to your PC
subprocess.run(["adb", "shell", "run-as", "com.lifelog", "cat", device_db_path], stdout=open(pc_db_path + "\\ActivityLog.realm", "wb"))