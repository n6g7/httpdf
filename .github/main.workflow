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

action "Test" {
  needs = "Install"
  uses = "Borales/actions-yarn@master"
  args = "test:run"
}

action "Build image" {
  uses = "actions/docker/cli@master"
  args = "build -t n6g7/httpdf:latest ."
}
