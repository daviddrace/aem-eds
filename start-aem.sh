#!/bin/bash

# Explicitly set Java 21 Home
export JAVA_HOME=$(/usr/libexec/java_home -v 21)
export PATH=$JAVA_HOME/bin:$PATH

echo "Using Java Home: $JAVA_HOME"
java -version

echo "Starting AEM Author..."
java -jar aem-sdk/author/aem-author-p4502.jar
