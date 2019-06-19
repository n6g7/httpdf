workflow "CI" {
  on = "push"
  resolves = [
    "Lint",
    "Test",
    "Build image",
  ]
}

action "Install" {
  uses = "Borales/actions-yarn@master"
  args = "install"
}

action "Lint" {
  needs = "Install"
  uses = "Borales/actions-yarn@master"
  args = "check"
}

action "Build app" {
  needs = "Install"
  uses = "Borales/actions-yarn@master"
  args = "build:app"
}

action "Prebuild documents" {
  needs = "Build app"
  uses = "Borales/actions-yarn@master"
  args = "prebuild"
  env = {
    HTTPDF_DOCUMENTS_SRC = "./__tests__/documents"
    HTTPDF_DOCUMENTS_DIST = ".build"
  }
}

action "Test" {
  needs = "Prebuild documents"
  uses = "Borales/actions-yarn@master"
  args = "test:run"
  env = {
    DEBUG = "httpdf:*"
    HTTPDF_DOCUMENTS_SRC = "./__tests__/documents"
    HTTPDF_DOCUMENTS_DIST = ".build"
    PORT = "8000"
  }
}

action "Build image" {
  uses = "actions/docker/cli@master"
  args = "build -t n6g7/httpdf:latest ."
}
