provider "docker" {
  host = "unix:///var/run/docker.sock"
}

resource "docker_image" "app" {
  name         = "golden-signal-app"
  build {
    context    = "."
  }
}

resource "docker_container" "app" {
  name  = "golden-signal-app"
  image = docker_image.app.name
  ports {
    internal = 8080
    external = 8080
  }
}
