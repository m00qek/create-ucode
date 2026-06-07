cmake_minimum_required(VERSION 3.10)
project({{PKG_NAME}}_native C)

find_library(UCODE_LIB ucode)

add_library(native SHARED native.c)
set_target_properties(native PROPERTIES PREFIX "")
target_link_libraries(native ${UCODE_LIB})
install(TARGETS native DESTINATION lib/ucode/{{PKG_NAME}})
