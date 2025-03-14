#!/bin/bash

LANGUAGE=$1
CODE_FILE=$2
INPUT_FILE=$3

TIMEOUT=3

execute_with_timeout() {
  timeout $TIMEOUT bash -c "$1"
  if [ $? -eq 124 ]; then
    echo "Execution timed out"
    exit 1
  fi
}

echo "Executing: $LANGUAGE - $CODE_FILE with input $INPUT_FILE" >> /usr/src/app/logs.txt

case "$LANGUAGE" in
  "c")
    gcc "$CODE_FILE" -o output && execute_with_timeout "./output < \"$INPUT_FILE\""
    ;;
  "cpp")
    g++ "$CODE_FILE" -o output && execute_with_timeout "./output < \"$INPUT_FILE\""
    ;;
  "python")
    execute_with_timeout "python3 \"$CODE_FILE\" < \"$INPUT_FILE\""
    ;;
  "javascript")
    execute_with_timeout "node \"$CODE_FILE\" < \"$INPUT_FILE\""
    ;;
  "java")
    JAVA_DIR=$(dirname "$CODE_FILE")

    # Extract the public class name from the Java file
    CLASS_NAME=$(grep -oP 'public\s+class\s+\K\w+' "$CODE_FILE")

    # If no public class is found, use "Main" as the default class
    if [ -z "$CLASS_NAME" ]; then
        CLASS_NAME="Main"
    fi

    # Define the correct Java file name
    NEW_CODE_FILE="$JAVA_DIR/$CLASS_NAME.java"

    # Print debugging info
    echo "Renaming $CODE_FILE to $NEW_CODE_FILE" >> /usr/src/app/logs.txt

    # Ensure no conflict before renaming
    if [ "$CODE_FILE" != "$NEW_CODE_FILE" ]; then
        mv "$CODE_FILE" "$NEW_CODE_FILE"
    fi

    # Compile and execute
    javac "$NEW_CODE_FILE" && execute_with_timeout "java -cp \"$JAVA_DIR\" \"$CLASS_NAME\" < \"$INPUT_FILE\""
    ;;
  *)
    echo "Unsupported language"
    exit 1
    ;;
esac
